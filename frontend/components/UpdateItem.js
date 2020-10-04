import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    updateItem(
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

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
