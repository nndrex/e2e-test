import fetch from 'node-fetch';
import { logger } from '../lib/logger';
import { Movie } from '../entities/movie';
import { MovieRepository } from '../repositories/movie.repositorie';
import { PersonRepositorie } from '../repositories/person.repositorie';
require('@dotenvx/dotenvx').config()

const API_URL = process.env.API_URL;

if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}

const movieRepository= new MovieRepository();
const personRepositorie =  new PersonRepositorie();
export async function getMovieData(id: number): Promise<any> {
    const url = `${API_URL}/${id}`;
    logger.info(`url: ${url}`);
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    logger.info(`service Fetching movie data for id: ${id}`);
    const data = await response.json();
    logger.info(`service data:`);
    logger.info(data);
    const movie = data as Movie;
    const result = movieRepository.saveMovie(movie);
    await personRepositorie.getPersons();
    return result;
}