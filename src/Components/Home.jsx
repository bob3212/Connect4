import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

export default function Home() {
    return(
        <div>
            <Container>
                <Jumbotron>
                    <h1>Welcome to Connect 4!</h1>
                    <p>
                        Please Login to your account (or sign up if you are new)
                    </p>
                    <div>
                        <Button variant="outline-primary" size='lg' href="/login">Log In</Button>
                        <Button variant="outline-primary" size='lg' href="/signup">Sign Up</Button>
                    </div>
                </Jumbotron>
            </Container>
        </div>
    )
}

