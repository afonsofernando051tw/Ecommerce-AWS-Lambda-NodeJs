import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ssm from "aws-cdk-lib/aws-ssm";

export class ProductAppLayersStack extends cdk.Stack {
    readonly productAppLayer: lambda.LayerVersion;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) { 
        super(scope, id, props);

        const productAppLayer = new lambda.LayerVersion(this, "ProductsLayer", {
            code: lambda.Code.fromAsset("lambda/products/layers/productsLayer"),
            compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
            layerVersionName: "ProductsLayer",
            removalPolicy: cdk.RemovalPolicy.RETAIN
        });

        new ssm.StringParameter(this, "ProductsLayerVersionArn", {
            parameterName: "ProductAppLayerVersionArn",
            stringValue: productAppLayer.layerVersionArn
        });

          const productEventsLayer = new lambda.LayerVersion(this, "ProductEventsLayer", {
            code: lambda.Code.fromAsset("lambda/products/layers/productEventsLayer"),
            compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
            layerVersionName: "ProductEventsLayer",
            removalPolicy: cdk.RemovalPolicy.RETAIN
        });

        new ssm.StringParameter(this, "ProductEventsLayerVersionArn", {
            parameterName: "ProductEventsLayerVersionArn",
            stringValue: productEventsLayer.layerVersionArn
        });
    }
}