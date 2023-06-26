#!/bin/bash
echo "Stop Container"
# docker stop silberfluss_assessment_backend
docker stop silberfluss_assessment_frontend
echo "Start Container"
docker-compose -f ./docker-compose.yml up