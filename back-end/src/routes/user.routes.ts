import { Request, Response, Router } from 'express'
import { createCache, memoryStore } from 'cache-manager';

const MINUTES =  60 * 1000
const router = Router();

// Create memory cache synchronously
const cache = createCache(memoryStore(), {
  max: 100,
  ttl: 60 * MINUTES,
});

router.get("/", async (req: Request, res: Response) => {
    const searchParams = new URLSearchParams(req.query as Record<string, string>).toString();
    const cachedData = await cache.get('users');
    if (cachedData) {
        res.send(cachedData)
    } else {
        try {
            const response = await fetch(`https://reqres.in/api/users?${searchParams}`)
            if (!response.ok) {
                res.status(response.status).send(response.statusText)
            } else {
                const users = await response.json();
                // console.log('Success fetching', users)
                await cache.set('users', users, 2 * MINUTES);
                res.send(users);
            }
        } catch (error) {
            console.log(error);
        }
    }
});
  
router.get("/:id", async (req: Request, res: Response) => {
    const { id: userId } = req.params;
    const cachedData = await cache.get(`user_${userId}`);
    if (cachedData) {
        res.send(cachedData)
    } else {
        try {
            const response = await fetch(`https://reqres.in/api/users/${userId}`)
            if (!response.ok) {
                res.status(response.status).send(response.statusText)
            } else {
                const user = await response.json();
                console.log('Success fetching', user)
                await cache.set(`user_${userId}`, user, 5 * MINUTES);
                res.send(user);
            }
        } catch (error) {
            console.log(error);
        }
    }
});

router.post("/create/", async (req: Request, res: Response) => {
    const { body } = req
    try {
        const response = await fetch('https://reqres.in/api/users', {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) {
            res.status(response.status).send(response.statusText)
        } else {
            const user = await response.json();
            console.log('Success creating', user)
            await cache.del('users');
            res.status(201).send(user);
        }
    } catch (error) {
        console.log(error)
    }
});

export default router