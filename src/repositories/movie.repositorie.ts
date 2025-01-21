import { DynamoDB } from 'aws-sdk';
import { Movie } from '../entities/movie';
import { logger } from '../lib/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = 'moviesTable';

export class MovieRepository {
    async getMovieByTitulo(titulo: string): Promise<Movie | null> {
        logger.info('Movie repository :: getMovieByTitulo');
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'TituloIndex',
            KeyConditionExpression: 'titulo = :titulo',
            ExpressionAttributeValues: {
                ':titulo': titulo
            }
        };

        const result = await dynamoDb.query(params).promise();
        logger.info('result', result);
        return result.Items ? (result.Items[0] as Movie) : null;
    }

    async getMovieByEpisodioId(episodio_id: number): Promise<Movie | null> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                episodio_id: episodio_id
            }
        };

        const result = await dynamoDb.get(params).promise();
        return result.Item ? (result.Item as Movie) : null;
    }

    async updateMovieByEpisodioId(episodio_id: number, movie: Partial<Movie>): Promise<void> {
        const updateExpression = Object.keys(movie).map((key, index) => `${key} = :value${index}`).join(', ');
        const expressionAttributeValues = Object.keys(movie).reduce((acc, key, index) => {
            acc[`:value${index}`] = (movie as any)[key];
            return acc;
        }, {} as { [key: string]: any });

        const params = {
            TableName: TABLE_NAME,
            Key: {
                episodio_id: episodio_id
            },
            UpdateExpression: `set ${updateExpression}`,
            ExpressionAttributeValues: expressionAttributeValues
        };

        await dynamoDb.update(params).promise();
    }

    async deleteMovieByEpisodioId(episodio_id: number): Promise<void> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                episodio_id: episodio_id
            }
        };

        await dynamoDb.delete(params).promise();
    }
    async saveMovie(movie: Movie): Promise<boolean> {

        const params = {
            TableName: TABLE_NAME,
            Item: movie
        };
        let result = false;
        try{
        await dynamoDb.put(params).promise();
        result=true;
        }catch(err){
            logger.error(err);
        }
        return result;
    }
}