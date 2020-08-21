import React from 'react';
import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

class MyApp extends App {

    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        pageProps.query = ctx.query;
        return { pageProps }; // recall: this is a special next.js method -> pageProps will be available via props
    }

    render() {
        const { Component, apollo, pageProps } = this.props;

        return (
            <Container>
                <ApolloProvider client={ apollo }>
                    <Page>
                        <Component { ...pageProps } />
                    </Page>
                </ApolloProvider>
            </Container>
        )
    }

}

export default withData(MyApp);
