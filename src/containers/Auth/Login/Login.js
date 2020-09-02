import React from "react";
import classes from './Login.module.css';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import Input from "../../../components/UI/Input/Input";
import Button from '../../../components/UI/AuthButton/AuthButton';
import * as actions from '../../../store/actions/auth';


class Login extends React.Component{
    state = {
        controls: {
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username or Email'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
        },
    }

    checkValidity(value, rules){
        let isValid = true;
        if (rules) {
            if (rules.required) {
                isValid = value.trim() !== '' && isValid;
            }
        }
        return isValid;
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.Login(
            this.state.controls.username.value,
            this.state.controls.password.value
        )
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value,
                    this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({controls: updatedControls});
    }

    render() {
        const formElementArray = []
        for(let key in this.state.controls){
            formElementArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementArray.map(formElement => (
            <Input
                key ={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(event) => (this.inputChangedHandler(event,
                formElement.id))}

                shouldValidate={true}
                touched={formElement.config.touched}
                invalid={!formElement.config.valid}
            />
        ))

        return (
            <div className={classes.Login}>
                <form>
                    {form}
                    <br/>
                    <Button click={this.submitHandler}>
                        Login
                    </Button>
                </form>
            </div>
        );
    }

}

const mapStateToProps = (state) => (
    {
        AuthRedirectPath: state.auth.AuthRedirectPath
    }
);

const mapDispatchToProps = (dispatch) => (
    {
        Login: (username, password) => dispatch(actions.login(username, password))
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(Login)