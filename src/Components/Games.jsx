import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';


export default function Games() {
    return(
        <div>
            <Container>
                <h1>Here are your active games</h1>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Game #</th>
                            <th>Opponent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Larry</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Mark</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>Jacob</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>Larry</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>Mark</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>Jacob</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>Larry</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>Mark</td>
                        </tr>
                        <tr>
                            <td>11</td>
                            <td>Jacob</td>
                        </tr>
                        <tr>
                            <td>12</td>
                            <td>Larry</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}