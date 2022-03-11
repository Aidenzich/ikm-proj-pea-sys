import {Card, Container, Button, Row, Col,Navbar, Nav} from 'react-bootstrap';

export const MyNav=()=>{
    return (
        <Navbar bg="white" expand="lg">
            <Container>
            <Navbar.Brand href="#home">計畫演變分析系統</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
} 

