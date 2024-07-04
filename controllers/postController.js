import Post from '../models/postModel.js'
import Tag from '../models/tagModel.js'

export const getTags = async (req, res) => {
    try{

        const tags = await Tag.find({});

        return res.status(200).json({
            msg: 'Success',
            data: tags
        })

    }catch(error){
        return res.status(500).json({
            msg: error
        })
    }
}

export const getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const tags = req.query.tags || [];
    const title = req.query.title || '';
    const pageSize = 10;
    try{


        const tagDocuments = await Tag.find({ name: { $in: tags } });

        const tagIds = tagDocuments.map(tag => tag._id);

        let posts;
        
        if(tagIds.length){
            posts = await Post.find(
                {
                $and: [ 
                    { tags: { $all: tagIds } },
                    { title: { $regex: title, $options: 'i' } }
                ]
                }
            )
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate({
                path: 'tags',
                select: 'name'
            });
        }else{
            posts = await Post.find(
                { title: { $regex: title, $options: 'i' } }
            )
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate({
                path: 'tags',
                select: 'name'
            });
        }

        console.log(posts)
        
        const totalPages = Math.ceil(posts.length / pageSize);

        return res.status(200).json({
            posts: posts.reverse(),
            current_page: page,
            total_page: totalPages,
            page_size: pageSize,
            total: posts.length
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }
}

export const createPost = async (req, res) => {
    try{
        
        const {title, description, tags} = req.body;

        const post1 = await Post.create({
            title: title,
            description: description,
            tags: tags,
            author: res.locals.auth._id
        })

        const post = await Post.findById(post1._id).populate({
            path: 'tags',
            select: 'name'
        })

        return res.status(200).json({
            msg: 'Success',
            data: post
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }
}

export const updatePost = async (req, res) => {
    try{
        
        const {title, description, tags} = req.body;
        const {id} = req.params;

        const post = await Post.findById(id);

        if(post.author.toString()!==res.locals.auth._id.toString()){
            return res.status(400).json({
                msg: 'Mission Failed'
            })
        }

        post.title = title;
        post.description = description;
        post.tags = tags;

        await post.save();

        return res.status(200).json({
            msg: 'Success',
            data: post
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }
}

export const deletePost = async (req, res) => {
    try{
        
        const {id} = req.params;

        const post = await Post.findById(id);

        if(post.author.toString()!==res.locals.auth._id.toString()){
            return res.status(400).json({
                msg: 'Mission Failed'
            })
        }

        await post.deleteOne();

        return res.status(200).json({
            msg: 'Success',
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }
}