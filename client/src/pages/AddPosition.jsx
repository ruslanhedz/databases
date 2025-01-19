import {Container, Button, Form, FormControl, FormGroup, FormLabel, FormCheck} from 'react-bootstrap';

function AddAnimal(){
    return(
        <Container>
                    <FormLabel>Image</FormLabel>
                </FormGroup>
                <FormGroup controlId="name" className="mb-5 form-control-lg">
                    <FormLabel>Name</FormLabel>
                    <FormControl type="text" placeholder="Enter name"/>
                </FormGroup>
                <FormGroup controlId="species" className="mb-5 form-control-lg">
                    <FormLabel>Species</FormLabel>
                    <FormControl type="text" placeholder="Enter species"/>
                </FormGroup>
                <FormGroup controlId="breed" className="mb-5 form-control-lg">
                    <FormLabel>Breed</FormLabel>
                    <FormControl type="text" placeholder="Enter breed"/>
                </FormGroup>
                <FormGroup controlId="age" className="mb-5 form-control-lg">
                    <FormLabel>Age</FormLabel>
                    <FormControl type="number" placeholder="Enter age" min="0" max="100"/>
                </FormGroup>
                <FormGroup controlId="sex" className="mb-5 form-control-lg">
                    <FormLabel>Sex</FormLabel>
                    <FormCheck type="radio" label="Male" id="male" name="sex"/>
                    <FormCheck type="radio" label="Female" id="female" name="sex"/>
                </FormGroup>
                <FormGroup controlId="description" className="mb-5 form-control-lg">
                    <FormLabel>Description</FormLabel>
                    <FormControl as="textarea" rows={5} placeholder="Enter description"/>
                </FormGroup>
                <div className="text-end mb-5 btn-lg">
                    <Button variant="primary" type="submit">
                        Add an animal
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default AddAnimal;
