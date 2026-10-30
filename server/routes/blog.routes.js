const express = require('express');
const prisma = require('../config/prisma');
const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
});

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    const { slug } = req.params;
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog article:', error);
    res.status(500).json({ error: 'Failed to fetch article.' });
  }
});

module.exports = router;
