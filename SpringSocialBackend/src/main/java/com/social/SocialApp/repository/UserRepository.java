package com.social.SocialApp.repository;

import com.social.SocialApp.model.users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<users, String> {

}
