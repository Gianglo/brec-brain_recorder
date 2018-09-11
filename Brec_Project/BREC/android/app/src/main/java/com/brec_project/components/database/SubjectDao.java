package com.brec_project.components.database;

import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Delete;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import java.util.List;

@Dao
public interface SubjectDao {


    @Query("SELECT * FROM subject ORDER BY id DESC")
    List<Subject> getAll();


    @Query("SELECT * FROM subject WHERE id = :subjectId")
    Subject getById(int subjectId);


    @Query("SELECT * FROM subject " +
            "WHERE name = :name " +
            "AND surname = :surname " +
            "AND born_date = :bornDate " +
            "ORDER BY id DESC")
    Subject getBySubject(String name, String surname, String bornDate);


    @Insert(onConflict = OnConflictStrategy.IGNORE)
    long insert(Subject subject);


    @Delete
    void delete(Subject subject);
}
