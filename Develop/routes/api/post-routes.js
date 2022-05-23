const router = require('express').Router();
const res = require('express/lib/response');
const { Post, User, Vote, Comment } = require('../../models');
const { route } = require('./user-routes');
const sequelize = require('../../config/connection');

//get all users
router.get('/', (req, res) => {
    console.log('=======================');
    Post.findAll({
        order:[['created_at', 'DESC']],
        //query configuration
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),'vote_count']
        ],
        include : [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//single post route
router.get('/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),'vote_count']
        ],
        include : [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData){
            res.status(404).json({ message: 'No post found with this id'})
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Post routes
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

//update a post title
router.put('/:id', (req,res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id '});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id:req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.json(404).json({ message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;