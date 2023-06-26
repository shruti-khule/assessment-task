# Silberfluss - Tech Challenge

This repo consists of a very simple version of our process engine, which executes the workflows created in our no-code interface. 

## Requirements & Installation

You need Docker running on your device / your WSL. Online you can find numerous sources for the installation on your OS.

## How to run?

After you've installed Docker, you can run

```bash
./run.sh
```

to build the docker container and start it. If errors are displayed at launch, please contact Jan.

You can then access the frontend at `http://localhost:4200` and the backend at `http://localhost:1337`. 

When you open the application in your browser, you will see questions that you can answer. After answering one question, the next one will pop up.

## Tasks

0. Familiarize yourself with the code structure. Pay attention to where the question are defined, the data is fetched and displayed.
1. You will notice that your responses to the questions are not persisted after reloading the page. Introduce a possibility to save these answers in the backend, such that when reloading the page you can select your previous responses and see your answers. Also introduce a possibility to add and delete answers. There is no need for using a database, instead you could use variables in flask.
2. Add a signature node in addition to the prompt node inside the `nodes` folder. The signature node should display a field where you can sign with your mouse. This output should be rendered in the list of questions.
3. Upload the signatures as images to the backend and store them.
4. Bonus: Add database support for persisting the answers given. You can either the DBMS direcly on your OS or add an additional service in the `docker-compose` file.

## Questions?

Feel free to reach out Jan via jan.jakob@silberfluss.io or phone (+49 176 47255072). 
