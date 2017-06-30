#!/bin/bash

eval $(aws ecr get-login --no-include-email --region us-east-2)
docker build -t xoliba-front-aws .
docker tag xoliba-front-aws:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/xoliba-docker-repo:front
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/xoliba-docker-repo:front
