const express = require('express');
const router = express.Router();
const { Swap, Post, User } = require('../db');
const { protect } = require('../middleware/auth');

router.get('/all', protect, async (req, res) => {
    try {
        const swaps = await Swap.find({})
            .populate('post', 'title skillOffered skillWanted')
            .populate('requester', 'firstName lastName profilePhoto')
            .populate('provider', 'firstName lastName profilePhoto')
            .sort('-createdAt');

        res.json({
            success: true,
            count: swaps.length,
            data: swaps
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching all swaps'
        });
    }
});

router.get('/', protect, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { provider: req.user.id }]
    })
    .populate('post', 'title skillOffered skillWanted')
    .populate('requester', 'firstName lastName profilePhoto')
    .populate('provider', 'firstName lastName profilePhoto')
    .sort('-createdAt');

    res.json({
      success: true,
      count: swaps.length,
      data: swaps
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate('post')
      .populate('requester', 'name profilePhoto rating location')
      .populate('provider', 'name profilePhoto rating location')
      .populate('messages.sender', 'name profilePhoto');

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (swap.requester._id.toString() !== req.user.id && 
        swap.provider._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this swap'
      });
    }

    res.json({
      success: true,
      data: swap
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/', protect, async (req, res) => {
  const { postId, message } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request swap on your own post'
      });
    }

    const existingSwap = await Swap.findOne({
      post: postId,
      requester: req.user.id
    });

    if (existingSwap) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested a swap for this post'
      });
    }

    const swap = await Swap.create({
      post: postId,
      requester: req.user.id,
      provider: post.user,
      messages: [{
        sender: req.user.id,
        message: message || 'I am interested in this swap!'
      }]
    });

    await swap.populate('post', 'title skillOffered skillWanted');
    await swap.populate('requester', 'name profilePhoto');
    await swap.populate('provider', 'name profilePhoto');

    res.status(201).json({
      success: true,
      data: swap
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  try {
    let swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (status === 'accepted' || status === 'rejected') {
      if (swap.provider.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to update this swap'
        });
      }
    } else if (status === 'cancelled') {
      if (swap.provider.toString() !== req.user.id && 
          swap.requester.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to update this swap'
        });
      }
    } else if (status === 'completed') {
      if (swap.provider.toString() !== req.user.id && 
          swap.requester.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to update this swap'
        });
      }
    }

    swap.status = status;
    
    if (status === 'accepted') {
      await Post.findByIdAndUpdate(swap.post, { status: 'pending' });
    }
    
    if (status === 'completed') {
      await Post.findByIdAndUpdate(swap.post, { status: 'completed' });
      
      await User.findByIdAndUpdate(swap.provider, { $inc: { swapsCompleted: 1 } });
      await User.findByIdAndUpdate(swap.requester, { $inc: { swapsCompleted: 1 } });
    }

    await swap.save();

    res.json({
      success: true,
      data: swap
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/:id/messages', protect, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }

  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (swap.requester.toString() !== req.user.id && 
        swap.provider.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to send messages in this swap'
      });
    }

    swap.messages.push({
      sender: req.user.id,
      message
    });

    await swap.save();
    await swap.populate('messages.sender', 'name profilePhoto');

    res.json({
      success: true,
      data: swap.messages[swap.messages.length - 1]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/:id/rate', protect, async (req, res) => {
  const { rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a rating between 1 and 5'
    });
  }

  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (swap.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed swaps'
      });
    }

    let ratingField, userToRate;
    
    if (swap.provider.toString() === req.user.id) {
      ratingField = 'requesterRating';
      userToRate = swap.requester;
    } else if (swap.requester.toString() === req.user.id) {
      ratingField = 'providerRating';
      userToRate = swap.provider;
    } else {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to rate this swap'
      });
    }

    if (swap[ratingField].rating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this swap'
      });
    }

    swap[ratingField] = {
      rating,
      review: review || ''
    };
    await swap.save();

    const user = await User.findById(userToRate);
    const newTotalRatings = user.totalRatings + 1;
    const newAvgRating = ((user.rating * user.totalRatings) + rating) / newTotalRatings;
    
    await User.findByIdAndUpdate(userToRate, {
      rating: newAvgRating,
      totalRatings: newTotalRatings
    });

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/request', protect, async (req, res) => {
    const { providerId, mySkill, theirSkill, message } = req.body;
    const requesterId = req.user.id;

    if (!providerId || !mySkill || !theirSkill) {
        return res.status(400).json({ success: false, message: 'Missing required fields for swap request.'});
    }
    if (providerId === requesterId) {
        return res.status(400).json({ success: false, message: 'You cannot initiate a swap with yourself.' });
    }

    try {
        const existingSwap = await Swap.findOne({
            provider: providerId,
            requester: requesterId,
            status: 'pending',
            'details.skillOfferedByRequester': mySkill,
            'details.skillWantedByRequester': theirSkill,
        });
        if (existingSwap) {
            return res.status(400).json({ success: false, message: 'You have already made this exact pending request.'});
        }

        const swap = await Swap.create({
            requester: requesterId,
            provider: providerId,
            details: {
                skillOfferedByRequester: mySkill,
                skillWantedByRequester: theirSkill,
            },
            messages: [{
                sender: requesterId,
                message: message || `Hi! I'd like to swap my '${mySkill}' skill for your '${theirSkill}' skill.`
            }]
        });

        res.status(201).json({ success: true, data: swap });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;