# React D3 Webpack and Docker Project


## Setup

Make sure you have `docker` and `docker-compose` installed on your machine.

Commands

To build the project

    make

To run the project

    make run

To jump into container

    $ make shell
    root@<containerid>:/project#

To stop running containers

    make stop

To test the UI, navigate to

    http://0.0.0.0:8080/

and enter 
   
    Device UUID: cf4844bc-a107-4e0a-84e1-fa04d76d388c
                   
 
    End Time: 1524835983


    Window Time: 60

   
    Number of windows: 10

finally, click Send

You should see the D3 chart on the right side of the screen.
