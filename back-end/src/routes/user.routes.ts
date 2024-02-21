import { Request, Response, Router } from 'express'
import { createCache, memoryStore } from 'cache-manager';

const MINUTE =  60 * 1000
const router = Router();

// Create memory cache synchronously
const cache = createCache(memoryStore(), {
  max: 100,
  ttl: 60 * MINUTE,
});

router.get("/", async (req: Request, res: Response) => {
    const searchParams = new URLSearchParams(req.query as Record<string, string>).toString();
    const cachedData = await cache.get('users_page_' + req.query.page);
    if (cachedData) {
        console.log('Success fetching cached', cachedData);
        res.send(cachedData);
    } else {
        try {
            console.log(`https://reqres.in/api/users?${searchParams}`)
            const response = await fetch(`https://reqres.in/api/users?${searchParams}`);
            if (!response.ok) {
                // Handle HTTP errors
                res.status(response.status).send(response.statusText)
            } else {
                const users = await response.json();
                console.log('Success fetching', users);
                // Cache for 2 minutes
                await cache.set('users_page_' + req.query.page, users, 2 * MINUTE);
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
        console.log('Success fetching cached', cachedData);
        res.send(cachedData);
    } else {
        try {
            const response = await fetch(`https://reqres.in/api/users/${userId}`);
            if (!response.ok) {
                // Handle HTTP errors
                res.status(response.status).send(response.statusText);
            } else {
                const user = await response.json();
                console.log('Success fetching', user);
                // Cache for 5 minutes
                await cache.set(`user_${userId}`, user, 5 * MINUTE);
                res.send(user);
            }
        } catch (error) {
            console.log(error);
        }
    }
});

router.post("/create/", async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const response = await fetch('https://reqres.in/api/users', {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            // Handle HTTP errors
            res.status(response.status).send(response.statusText);
        } else {
            const user = await response.json();
            console.log('Success creating', user);
            // Invalidate cached data for users
            // XXX: Hard-coded
            await cache.del('users_page_1');
            await cache.del('users_page_2');
            res.status(201).send(user);
        }
    } catch (error) {
        console.log(error);
    }
});

export default router