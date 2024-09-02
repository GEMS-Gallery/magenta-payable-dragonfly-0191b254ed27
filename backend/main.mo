import Bool "mo:base/Bool";
import Func "mo:base/Func";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;

  // Function to create a new post
  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    post.id
  };

  // Function to get all posts, sorted by newest first
  public query func getPosts() : async [Post] {
    Array.sort(posts, func(a: Post, b: Post) : { #less; #equal; #greater } {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    })
  };

  // Function to get a specific post by ID
  public query func getPost(id: Nat) : async ?Post {
    Array.find(posts, func(post: Post) : Bool { post.id == id })
  };
}
