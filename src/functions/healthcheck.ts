import { logger } from "../lib/logger";
import { getMovieData } from "../services/movieService";

export async function handler(event) {
  const { id } = event.pathParameters;
  logger.info(`Fetching movie data for id: ${id}`);
  const result = await getMovieData(id);
  logger.info('result', result);
  const response = {
    statusCode: 200,
    body: {"result": "success"},
  };

  if(!result){
    response.statusCode = 400;
    response.body = {"result": "error"};
  }
   return {statusCode : response.statusCode, body: JSON.stringify(response.body)}; 
}


