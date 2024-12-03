package com.g1appdev.Hubbits.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g1appdev.Hubbits.entity.PetEntity;
import com.g1appdev.Hubbits.repository.PetRepository;

@Service
public class PetService {
    @Autowired
    PetRepository prepo;

    public PetService(){
        super();
    }

    // Add record 
    public PetEntity postPetRecord(PetEntity pet){
        return prepo.save(pet);
    }

    // Get all records
    public List<PetEntity> getAllPets(){
        return prepo.findAll();
    }

    public PetEntity getPetById(int id) {
        Optional<PetEntity> pet = prepo.findById(id); // Assuming findById method exists
        return pet.orElse(null); // Return null if not found (handle this in the controller if needed)
  
    }
    // Update a record
    @SuppressWarnings("finally")
    public PetEntity putPetDetails(int pid, PetEntity newPetDetails){
        PetEntity pet = prepo.findById(pid).orElse(null); // Get the existing pet

        if (pet != null) { // Only update if the pet exists
            pet.setStatus(newPetDetails.getStatus()); // Update only the status
            return prepo.save(pet); // Save the updated pet
        } else {
            System.out.println("Pet " + pid + " not found.");
            return null; // Handle the case where the pet does not exist
        }
    }

    // Delete a record
    public String deletePet(int pid){
        String msg = "";
        if(prepo.findById(pid) != null){
            prepo.deleteById(pid);
            msg = "Pet Record successfully deleted!";
        }else{
            msg =  pid + " Not found!";
        }
        return msg;
    }

   /*  public List<PetEntity> findPetsByName(String name){
        return prepo.findPetsByName(name);
    }*/
}
