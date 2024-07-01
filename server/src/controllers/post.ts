import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { User } from '../models/User';

export const getPosts = async (req : Request, res : Response) => {
    try {
        const userId = req.session.userId; // 세션에서 가져오는 정보
        if (!userId) { 
            return res.status(401).json({ error: '글을 조회할 수 있는 권한이 없습니다.' });
        }

        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = 6; // 6개씩 가져오기
        const offset = (page - 1) * limit;
        const { count, rows } = await Post.findAndCountAll({
            where: { showStatus: true }, // 필터링(공개된 게시글만 표시)
            limit,
            offset,
            order: [['createdAt', 'DESC']], // 최신 순 정렬
            include: [{
                model: User,
                as: 'user',
                attributes: ['userName'],
            }],
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            posts : rows.map(post => ({
                id: post.id,
                author: post.user ? post.user.userName : 'Unknown',
                thumb: post.thumb,
                title: post.title,
                description: post.description,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                showStatus: post.showStatus,
            })),
            pagination: {
                totalItems: count, // 총 게시글
                currentPage: page, // 현재 페이지 번호
                totalPages : totalPages, // 총 페이지 수( 6개씩 몇 장 )
                pageSize: limit, // 한 페이지 당 게시글 수 (6개)
            },
        });
    } catch (error) {
        res.status(500).json({ error: '게시글 조회에 실패하였습니다.' });
    }
}

export const createPost = async (req: Request, res: Response) => {
    try {
        const defaultPostImg = 'https://cdn-icons-png.flaticon.com/512/3875/3875148.png'
        const userId = req.session.userId; // 세션에서 가져오는 정보
        if (!userId) { 
            return res.status(401).json({ error: '글을 생성할 수 있는 권한이 없습니다.' });
        }
        // request body에서 받는 정보 5가지
        const { thumb, title, description, content, showStatus } = req.body;
        const newPost = await Post.create({
            userId,
            thumb: thumb || defaultPostImg,
            title,
            description: description || content.substring(0, 150), // 입력이 없다면 본문에서 150자 가져오기
            content, 
            showStatus,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        res.status(201).json({message: '게시글 생성 완료'});
    } catch (error) {
        res.status(500).json({ error: '게시글 생성에 실패하였습니다.' });
    }
}

export const getPostById = async (req: Request, res: Response)  => {
    try {
        
        const userId = req.session.userId; // 세션에서 가져오는 정보
        if (!userId) { 
            return res.status(401).json({ error: '글을 조회할 수 있는 권한이 없습니다.' });
        }

        const postId = req.params.id;
        const post = await Post.findOne({
            where: { id: postId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['userName']
            }],
        });

        if (!post) {
            return res.status(404).json({
                error : '게시글을 찾을 수 없습니다.'
            })
        }

        res.status(200).json({
            id: post.id,
            author: post.user ? post.user.userName : 'Unknown',
            thumb: post.thumb,
            title: post.title,
            description: post.description,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            showStatus: post.showStatus,
        })
    } catch (error) {
        return res.status(500).json({ error: '게시글 조회에 실패하였습니다.' });
    }
}

export const updatePostById = async (req: Request, res: Response)  => {
    try {
        const postId = req.params.id;
        const { thumb, title, description, content, showStatus } = req.body;
    
        // 세션에서 userId 가져오기
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: "글을 수정할 수 있는 권한이 없습니다." });
        }

        const post = await Post.findOne({
            where: {id: postId}
        });
        if(!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' })
        }

        if(post.userId !== userId) {
            return res.status(403).json({ error : '권한이 없습니다.' })
        }
        
        post.thumb = thumb || post.thumb;
        post.title = title || post.title;
        post.description = description || post.description;
        post.content = content || post.content;
        post.showStatus = showStatus !== undefined ? showStatus : post.showStatus;
        post.updatedAt = new Date();

        await post.save(); // 저장
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({ error: '게시글 수정에 실패하였습니다.' });
    }
}

export const deletePostById = async (req: Request, res: Response)  => {
    try {
        const postId = req.params.id;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: '글을 삭제할 수 있는 권한이 없습니다.' });
        }

        const post = await Post.findOne({
            where: {id: postId}
        });
        if(!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' })
        }

        if(post.userId !== userId) {
            return res.status(403).json({ error : '글을 삭제할 수 있는 권한이 없습니다.' })
        }
        
        await post.destroy();
        res.status(200).json({ message: '게시글 삭제 완료.' });
        
    } catch (error) {
        res.status(500).json({ error: '게시글 삭제에 실패하였습니다.' });
    }
}


