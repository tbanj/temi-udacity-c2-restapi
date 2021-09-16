import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    // const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    // typescript equivalent
    const items: { count: number, rows: FeedItem[] } = await FeedItem.findAndCountAll({ order: [['id', 'DESC']] });
    items.rows.map((item: any) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key
router.get('/:id', requireAuth,
    async (req: Request, res: Response) => {
        try {
            let { id } = req.params;
            const result: FeedItem = await FeedItem.findByPk(id);
            console.warn('result', result);
            return res.status(200).send({ data: result });
        } catch (error) {
            console.error('error', error);

            res.status(500).send({
                message: "An error occured while retrieving data",
            });
        }

    })

// update a specific resource
router.patch('/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        //@TODO try it yourself
        try {
            const { id } = req.params;

            const updates = Object.keys(req.body);
            const userUpdate = req.body;
            let result: FeedItem = await FeedItem.findByPk(id);
            if (!result) res.status(400).json({ error: { message: 'no match data found' } });
            updates.map(property => {
                const resultObj: any = result['dataValues'];
                resultObj[property] = userUpdate[property];

                result['dataValues'] = { ...resultObj };
            });
            console.warn('result', result);
            await result.save();

            return res.status(200).send({ data: result });
            // res.send(500).send("not implemented")
        } catch (error) {
            console.error('error', error);
            res.status(500).send({
                message: "An error occured while retrieving data",
            });
        }
    });


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
        let { fileName } = req.params;
        const url = await AWS.getPutSignedUrl(fileName);
        console.log('url', url)
        res.status(201).send({ url: url });
    });

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
        const caption = req.body.caption;
        const fileName = req.body.url;

        // check Caption is valid
        if (!caption) {
            return res.status(400).send({ message: 'Caption is required or malformed' });
        }

        // check Filename is valid
        if (!fileName) {
            return res.status(400).send({ message: 'File url is required' });
        }

        const item = await new FeedItem({
            caption: caption,
            url: fileName
        });

        const saved_item: any = await item.save();

        saved_item.url = AWS.getGetSignedUrl(saved_item.url);
        res.status(201).send(saved_item);
    });

export const FeedRouter: Router = router;