#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerceApi-stack';
import * as dotenv from "dotenv"
import { ProductAppLayersStack } from "../lib/productsAppLayers-stacks"
import { EventsDdbStack } from "../lib/eventsDdb-stacks"

dotenv.config();

const app = new cdk.App();
const cdkEnv: cdk.Environment = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_REGION,
}

const tags = {  
  cost: "Ecommerce",
  team: "SiecolaCode"
}

const productAppLayersStack = new ProductAppLayersStack(app, "ProductAppLayers", {
  tags: tags,
  env: cdkEnv
});

const eventsDdbStack = new EventsDdbStack(app, "EventsDdb", {
  tags: tags,
  env: cdkEnv
});

const productsAppStack = new ProductsAppStack(app, "ProductsApp", { 
  eventsDdb: eventsDdbStack.table,
  tags: tags,
  env: cdkEnv
});

productsAppStack.addDependency(productAppLayersStack);
productsAppStack.addDependency(eventsDdbStack);

const ecommerceApiStack = new EcommerceApiStack(app, "EcommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: cdkEnv
})

ecommerceApiStack.addDependency(productsAppStack)