#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_PATH=$(dirname "$(readlink -f "$0")")
cd $SCRIPT_PATH;
cd ..;

if [[ ! -f ./.env ]]; then
  echo -e "\e[31mNo .env file detected. Exiting..."
  exit 1
fi

source ./.env

## CONF ##
function init() {
  ensureBuild "$SVC_NAME-id"
  ensureBuild "$SVC_NAME-test"
}
# /CONF ##

function buildImage() {
  docker build -t $APP_SLUG/$1 -f ${1/-dev/""}/Dockerfile ${1/-dev/""}
}

function ensureBuild() {
  if [ -z "$(docker image ls | grep $APP_SLUG/$1)" ]; then
    echo -e "\e[31m$APP_SLUG/$1 image not found\e[0m"
    echo "Would you like to build image? y/N"
    read input

    if [[ $input == "yes" || $input == "y" ]]; then
      if [[ $1 =~ -dev$ ]]; then
        buildImage $1
      elif [[ $1 =~ -test$ ]]; then
        buildImage $1
      else
        echo "build regular image...."
      fi
    else
      exit 1
    fi
  fi 
}

init

if [[ ( $1 == "test" ) ]]; then
  docker-compose run --rm test yarn test
elif [[ ( $1 == "stop" )]]; then
  docker-compose down -v
elif [[ ( $1 =~ build\:([a-z0-9\-]+) ) ]]; then
  buildImage "$SVC_NAME-${BASH_REMATCH[1]}"
elif [[ ( $1 =~ logs\:([a-z0-9]+) ) ]]; then
  docker logs -f "${SVC_NAME}_${BASH_REMATCH[1]}_1"
elif [[ ( $1 =~ exec\:([a-z0-9]+) )]]; then
  docker exec -it "${SVC_NAME}_${BASH_REMATCH[1]}_1" ${2:-bash}
elif [[ ( $1 == "h" || $1 == "help" ) ]]; then
  echo "List of commands"
  echo -e "\e[36mstart\e[0m - Calls docker-compose run in test:watch mode"
  echo -e "\e[36mstop\e[0m - Calls docker-compose down"
  echo -e "\e[36mbuild:[svc]\e[0m - Builds $SVC_NAME-[svc] docker image"
  echo -e "\e[36mlogs:[svc]\e[0m - View $SVC_NAME-[svc] logs"
  echo -e "\e[36mexec:[svc] [cmd]\e[0m - Exec into $SVC_NAME-[svc] container. Defaults to 'bash' cmd"
  echo -e "\e[36mhelp | h\e[0m - Show available commands"
else
  echo -e "\e[31munknown command\e[0m"
fi


