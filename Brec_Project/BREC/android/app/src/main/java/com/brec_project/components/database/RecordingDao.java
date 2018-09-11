package com.brec_project.components.database;

import java.util.List;
import android.arch.persistence.room.*;

@Dao
public interface RecordingDao {


    @Query("SELECT * FROM recording ORDER BY id DESC")
    List<Recording> getAll();


    @Query("SELECT * FROM recording WHERE subject = :subject ORDER BY id DESC")
    List<Recording> getAllBySubject(long subject);


    @Query("SELECT s.id, s.name, s.surname, s.born_date FROM recording r JOIN subject s ON r.subject = s.id WHERE r.id = :recId")
    Subject getSubject(long recId);


    @Insert
    long insert(Recording recording);


    @Delete
    void delete(Recording recording);
}
