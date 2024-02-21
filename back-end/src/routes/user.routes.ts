import { NextFunction, Request, Response, Router } from 'express'
import { createCache, memoryStore } from 'cache-manager';

const MINUTE =  60 * 1000
const router = Router();

const getErrorObject = (httpCode: number) => {
    if (httpCode >= 500) {
        return {mesage: 'Server error!'};
    } else if(httpCode >= 400) {
        if (httpCode === 400)
            return {mesage: 'Invalid reqeust!'};
        if (httpCode === 404)
            return {mesage: 'Item not found!'};
    }
}

// Create memory cache synchronously
const cache = createCache(memoryStore(), {
  max: 100,
  ttl: 60 * MINUTE,
});

// Add simple retry mechanism
const fetchPlus = async (url: string, options = {}, retries = 3): Promise<any> => {
    try {
        const response = await fetch(url, options)
        if (retries === 0 || response.ok)
            return response
        return fetchPlus(url, options, retries - 1)
    }
    catch (error) {
        throw new Error('Error occured while fetching: ' + url);
    }
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const searchParams = new URLSearchParams(req.query as Record<string, string>).toString();
    const cachedData = await cache.get('users_page_' + req.query.page);
    if (cachedData) {
        console.log('Success fetching cached', cachedData);
        res.send(cachedData);
    } else {
        try {
            console.log(`https://reqres.in/api/users?${searchParams}`)
            const response = await fetchPlus(`https://reqres.in/api/users?${searchParams}`);
            if (!response.ok) {
                // Handle HTTP errors
                const errorObject = JSON.stringify(getErrorObject(response.status))
                res.status(response.status).type('application/json').send(errorObject)
            } else {
                const users = await response.json();
                console.log('Success fetching', users);
                // Cache for 2 minutes
                await cache.set('users_page_' + req.query.page, users, 2 * MINUTE);
                res.send(users);
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
});
  
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.params;
    const cachedData = await cache.get(`user_${userId}`);
    if (cachedData) {
        console.log('Success fetching cached', cachedData);
        res.send(cachedData);
    } else {
        try {
            const response = await fetchPlus(`https://reqres.in/api/users/${userId}`);
            if (!response.ok) {
                // Handle HTTP errors
                const errorObject = JSON.stringify(getErrorObject(response.status))
                res.status(response.status).type('application/json').send(errorObject)
            } else {
                const user = await response.json();
                console.log('Success fetching', user);
                // Cache for 5 minutes
                await cache.set(`user_${userId}`, user, 5 * MINUTE);
                res.send(user);
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
});

router.post("/create/", async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    try {
        const response = await fetchPlus('https://reqres.in/api/users', {
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            // Handle HTTP errors
            const errorObject = JSON.stringify(getErrorObject(response.status))
            res.status(response.status).type('application/json').send(errorObject)
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
        next(error)
    }
});

export default router