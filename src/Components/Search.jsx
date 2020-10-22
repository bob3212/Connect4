import React from 'react';
import { Form } from 'react-bootstrap';
import FormGroup from 'react-bootstrap/FormGroup';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

export default function Search() {
    return(
        <div>
            <Form>
                <Form.Row className="align-items-center">
                    <Col>
                    <Form.Label htmlFor="inlineFormInput"  srOnly>
                        Name
                    </Form.Label>
                    <Form.Control
                        className="mb-2"
                        id="inlineFormInput"
                        placeholder="Search for name here"
                        style={{ marginTop: "4rem", marginLeft: "4rem" }} 
                    />
                    </Col>
                    <Col>
                    <Button type="submit" className="mb-2" style={{ marginTop: "4rem"}} >
                        Submit
                    </Button>
                    </Col>
                </Form.Row>
            </Form>
        </div>
    )
}