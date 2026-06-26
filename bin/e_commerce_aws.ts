#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductsAppSack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerceApi-stack';
import * as dotenv from "dotenv"

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

const productsAppStack = new ProductsAppSack(app, "ProductsAppStack", { 
  tags: tags,
  env: cdkEnv
})

const ecommerceApiStack = new EcommerceApiStack(app, "EcommerceApiStack", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: cdkEnv
})

ecommerceApiStack.addDependency(productsAppStack)