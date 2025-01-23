import fetch from 'node-fetch';
import { Person } from '../entities/person';

export class PersonRepositorie {

    async getPersons(): Promise<Person[]> {
    try {
        const response = await fetch(process.env.MOCK_URL as string);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data= (await response.json()) as Person[];
        return data;
    } catch (error) {
        console.error('Error fetching persons:', error);
        throw error;
    }
}
}
