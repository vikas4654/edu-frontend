import gql from 'graphql-tag'

export const GET_CATEGORIES = gql`
    query GetCategories($isActive: Boolean){
        categories(isActive: $isActive){
            id,
            name
        }
    }
`

export const GET_CATEGORY_BY_ID = gql`
    query GetCategory($id: String!){
        category(id: $id){
            id,
            name
        }
    }
`

export const UPSERT_CATEGORY = gql`
    mutation AddCategory($id:String, $name: String!){
        addCategory(id: $id, name: $name){
            id,
            name
        }
    }
`


export const REMOVE_CATEGORY = gql`
    mutation RemoveCategories($isActive: Boolean){
        deleteCategory(isActive: $isActive){
            id,
            name
        }
    }
`
