import gql from 'graphql-tag'

export const GET_COURSES = gql`
    query GetCourses($isActive: Boolean, $department: String){
        courses(isActive: $isActive, department: $department){
            id,
            code,
            type,
            name,
            isActive,
            departmentName,
            duration
        }
    }
`
export const GET_ACTIVE_COURSES = gql`
    query GetActiveCourses{
        courses(isActive: true){
            id,
            code,
            type,
            name,
            isActive,
            departmentName,
            duration
        }
    }
`
export const GET_COURSE_BY_ID = gql`
    query GetCourse($id: String!){
        course(id: $id){
            id,
            code,
            type,
            name,
            isActive,
            isLateral,
            duration,
            departmentName,
            department
        }
    }
`
export const UPSERT_COURSE = gql`
    mutation AddCourse($id:String, $name:String!, $code: String!, $type:String!, $department:String!, $duration:String!, $isActive:Boolean){
        addCourse(course: {id:$id,name:$name,code:$code,type:$type,department:$department,duration:$duration,isActive:$isActive}){
            id,
            code,
            type,
            name,
            isActive,
            departmentName,
            duration
        }
    }
`

export const getCourseById = function (variables, skip = false) {
    return {
        query: GET_COURSE_BY_ID,
        variables,
        skip: skip
    }
}