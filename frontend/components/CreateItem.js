import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
    state = {
        title:'Cool Shoes',
        description:'I love thesen ikes',
        image: 'test.jpeg',
        largeImage: 'big.jpeg',
        price: 100,
    };

    handleChange = event => {
        const { name, type, value } = event.target;
        const val = type == 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }

    uploadFile = async event => {
        const files = event.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const response = await fetch('https://api.cloudinary.com/v1_1/dd0s39h0h/image/upload', {
            method: 'POST',
            body: data
        });

        const file = await response.json();
        console.log(file);

        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    };

    render() {
        return (
            <Mutation mutation={ CREATE_ITEM_MUTATION } variables={ this.state }>
                {
                    (createItem, { loading, error }) => (
                        <Form onSubmit =
                            {
                                async event => {
                                    event.preventDefault();
                                    const result = await createItem();
                                    console.log(result);
                                    Router.push({
                                        pathname: '/item',
                                        query: { id: result.data.createItem.id }
                                    })
                                }
                            }
                        >
                            <Error error={ error } />
                            <fieldset aria-busy= { loading } disabled={ loading }>
                                <label htmlFor="file">
                                Image
                                    <input
                                        id ="file"
                                        name="file"
                                        onChange={ this.uploadFile }
                                        placeholder="Upload an image"
                                        required
                                        type ="file"
                                    />
                                    {
                                        this.state.image &&
                                        <img
                                            alt="Upload Preview"
                                            src={ this.state.image }
                                            width="200"
                                        />
                                    }
                                </label>

                                <label htmlFor="title">
                                Title
                                    <input
                                        id ="title"
                                        name="title"
                                        onChange={ this.handleChange }
                                        placeholder="Title"
                                        required
                                        type ="text"
                                        value={ this.state.title }
                                    />
                                </label>

                                <label htmlFor="price">
                                Price
                                    <input
                                        id ="price"
                                        name="price"
                                        onChange={ this.handleChange }
                                        placeholder="Price"
                                        required
                                        type ="number"
                                        value={ this.state.price }
                                    />
                                </label>

                                <label htmlFor="description">
                                Description
                                    <textarea
                                        id ="description"
                                        name="description"
                                        onChange={ this.handleChange }
                                        placeholder="Enter a Description"
                                        required
                                        value={ this.state.description }
                                    />
                                </label>
                                <button type ="submit">Submit</button>
                            </fieldset>
                        </Form>
                    )
                }
            </Mutation>
        )
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
