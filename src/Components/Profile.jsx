import React from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FriendsList from './FriendsList';

export default function Profile() {
    return(
        <div>
            <Container>
                <h1>Profile Page</h1>
                <form>
                    <input type="checkbox"></input>
                    <label>Public</label>
                </form>
                <ListGroup>
                    <ListGroup.Item>Total Number of Games Played: </ListGroup.Item>
                    <ListGroup.Item>Wins</ListGroup.Item>
                    <ListGroup.Item>Losses</ListGroup.Item>
                    <ListGroup.Item>Win percentage</ListGroup.Item>
                </ListGroup>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Opponent</th>
                            <th>Win/Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mark</td>
                            <td>Win</td>
                        </tr>
                        <tr>
                            <td>Jacob</td>
                            <td>Win</td>
                        </tr>
                        <tr>
                            <td>Larry</td>
                            <td>Loss</td>
                        </tr>
                    </tbody>
                </Table>
                <FriendsList/>
            </Container>
        </div>
    )
}