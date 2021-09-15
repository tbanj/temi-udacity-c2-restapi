import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars: Car[] = cars_list;

  //Create an express applicaiton
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get("/api/v0/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/api/v0/persons/:name",
    (req: Request, res: Response) => {
      let { name } = req.params;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/api/v0/persons/", (req: Request, res: Response) => {
    let { name } = req.query;

    if (!name) {
      return res.status(400)
        .send(`name is required`);
    }

    return res.status(200)
      .send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post("/api/v0/persons",
    async (req: Request, res: Response) => {

      const { name } = req.body;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get("/api/v0/cars/", async (req, res) => {
    try {
      const { make } = req.query;
      console.log(req.query)
      // if (!make) {
      //   return res.status(400).send('make is required')
      // }

      let result: Car[] = cars_list;
      switch (true) {
        case Object.keys(req.query).length > 0 && Object.keys(req.query)[0].toString() === "make":
          const found: Car[] = cars_list.filter((data) => data.make === make);
          console.log(found);
          if (found.length < 1) {
            return res.status(400).send('make type not found');
          }
          result = found;
          break;

        default:
      }
      return res.status(200).send({ data: result });
    } catch (error) {
      res.status(500).send({
        message: "An error occured while retrieving data",
      });
    }
  })

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get('/api/v0/cars/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.warn(req.params);
      if (!id) {
        res.status(400).send('id is required');
      }

      const found = cars_list.findIndex((data: any) => data.id === parseInt(id));
      if (found === -1) {
        return res.status(404).send('data not found');
      }
      const result = cars_list[found];
      res.status(200).send({ data: result });

    } catch (error) {
      res.status(500).send({
        message: "An error occured while retrieving data",
      });
    }
  })


  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/api/v0/cars", async (req: Request, res: Response) => {
    try {
      const { id, type, model, cost } = req.body;
      if (!id) {
        return res.status(400).send(`id is required`)
      }
      if (!type) {
        return res.status(400).send(`type is required`)
      }
      if (!model) {
        return res.status(400).send(`model is required`)
      }
      if (!cost) {
        return res.status(400).send(`cost is required`)
      }

      const result = [...cars_list];
      res.status(201).send({ data: [...result, req.body] });

    } catch (error) {
      res.status(500).send({
        message: "An error occured while retrieving data",
      });
    }
  })
  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();