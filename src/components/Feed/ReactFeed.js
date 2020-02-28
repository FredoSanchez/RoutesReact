import React, {Component} from 'react';
import Post from './Post'
import {withRouter} from 'react-router-dom'
import {Helmet} from "react-helmet"
import axios from "axios"

const initValues = {
  title: "",
  text: "",
  image: ""
}

class ReactFeed extends Component {
  constructor(props){
    super(props);

    this.state = {
    ...initValues,
	  posts: [],
    token: localStorage.getItem("token"),
    }
  }

  changeHandler = (event) => {
    const {value, id} = event.target
		this.setState({
			[id]: value,
		})
  }
  
  async submitHandler(event){
    event.preventDefault()

    const {title, text, image} = this.state

    const config = {
      headers: {
        'Authorization': 'Bearer ' + this.state.token
      }
    }

    try {
      await axios.post('https://reactcourseapi.herokuapp.com/post/', {title, text, image}, config)
      this.setState(...initValues)
    } catch ({response}) {
      const {data} = response
      console.log(data.message)
      
    }
  }

  likeHandler = index => {
    let postsAux = [...this.state.posts];

	//postsAux[index].likes += 1;
	
	const config = {
		method: "PUT",
		headers: {
			'Content-type': 'Application/json',
			authorization: `Bearer ${this.state.token}`
		},
		body: JSON.stringify(postsAux[index])
	}

	fetch('https://reactcourseapi.herokuapp.com/post/like', config)
		.then(res => {this.fetchData()})
		
  }

  logoutHandler = () => {
    localStorage.clear()
    this.props.history.push("/login")
  }

  fetchData = () => {
	let config = {
		method: "GET",
		headers: {
			'Content-type': 'Application/json',
			authorization: `Bearer ${this.state.token}`
		}
	}

	fetch('https://reactcourseapi.herokuapp.com/post/', config)
		.then(res => res.json())
		.then(data => {
			this.setState({
				posts: data.filteredPosts || []
			})

		})
  }

  componentDidMount(){
	this.fetchData();
  }
  
  render(){
    const postsComponents = this.state.posts.map((post, index) => {
		
      return (<Post
        key = {index}
        name = {post.user}
		    likes = {post.likes}
        title = {post.title}
        text = {post.text}
        image = {post.image}
        onClick = {()=> this.likeHandler(index)}
        />);
      
    });

    const {title, text, image} = this.state
  
    return (
      <>
        <Helmet>
          <title>React Feed</title>
        </Helmet>
        <button onClick = {this.logoutHandler}>Logout</button>
        <div className = "container">
          <h1 className="display-3">ReactFeed</h1>
          <h2>Shitpostear</h2>
          <form onSubmit={this.submitHandler} type="submit">
            <input onChange={this.changeHandler} value={title} id="title" placeholder="Titulo"/>
            <input onChange={this.changeHandler} value={text} id="text" placeholder="Texto"/>
            <input onChange={this.changeHandler} value={image} id="image" placeholder="Imagen"/>
            <button>Publicar</button>
          </form>
          <h2>Recent posts</h2>
    
          <div className="posts">
            {postsComponents}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ReactFeed);
