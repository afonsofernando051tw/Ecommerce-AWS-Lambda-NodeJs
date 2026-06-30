#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductsAppSack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerceApi-stack';
import * as dotenv from "dotenv"
import { ProductAppLayersStack } from "../lib/productsAppLayers-stacks"

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

const productAppLayersStack = new ProductAppLayersStack(app, "ProductAppLayersStack", {
  tags: tags,
  env: cdkEnv
});

const productsAppStack = new ProductsAppSack(app, "ProductsAppStack", { 
  tags: tags,
  env: cdkEnv
});
productsAppStack.addDependency(productAppLayersStack);

const ecommerceApiStack = new EcommerceApiStack(app, "EcommerceApiStack", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: cdkEnv
})

ecommerceApiStack.addDependency(productsAppStack)