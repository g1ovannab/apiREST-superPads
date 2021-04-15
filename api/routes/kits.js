const mongoose = require('mongoose');
const express = require('express');

module.exports = app => {

    const router = express.Router();
    app.use('/kits', router);

    /* DATABASE */
    const kitSchema = {
        id: String,
        name: String,
        createdAt: Date,
        updatedAt: Date,
        isDeleted: Boolean
    }

    const Kit = mongoose.model('Kit', kitSchema);
    
    /* ROUTES */
    app.route('/kits').post((req, res) => {

        var data = req.body;

        data.forEach((item) => {
            
            const newKit = new Kit ({
                id: item.id,
                name: item.name,
                createdAt: (new Date),
                updatedAt: (new Date),
                isDeleted: false
            });
            
    
            newKit.save((err) => {
                if (!err){
                    console.log("Kit document inserted successfully");
                    res.status(201).end();
                } else {
                    console.log(err);
                }
            });
        });

    })
    .get((req, res) => {
        if (!req.query.name){
            Kit.find({'isDeleted': false}, (err, allKits) => {
                if (!err){
                    res.status(200).json(allKits); //Send all kits bc there's no query.
                } else {
                    res.send(err);
                }
            });
        } else {
            Kit.find({'name': req.query.name, 'isDeleted': false}, (err, foundKits) => {
                if (!err){
                    res.status(200).json(foundKits);
                } else {
                    res.send(err);
                }
            });
        }
    });


    app.route('/kits/:id')
    .put((req, res) => {
        Kit.findOneAndUpdate({'id': req.params.id}, {$set: {
            id: req.body.id,
            name: req.body.name,
            updatedAt: (new Date)
        }}, (err, updatedKit) => {
            if (!err){
                res.status(200).json(updatedKit);
            } else {
                res.send(err);
            }
        });
    })
    .get((req, res) => {
        Kit.find({'id': req.params.id, 'isDeleted': false}, (err, foundKit) => {
            if (!err){
                
                res.status(200).json(foundKit);
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Kit.findOneAndUpdate({'id': req.params.id}, {$set: {
            isDeleted: true,
            updatedAt: (new Date)
        }}, (err, deletedKit) => {
            if (!err){
                res.status(200).json(deletedKit);
            } else {
                res.send(err);
            }
        });
    });


    router.get('/fetch', (req, res) => {

        if (!req.query.timestamp){

            Kit.find({'isDeleted': false}, (err, allKits) => {
                if (!err){
                    res.status(200).json(allKits); //Send all kits bc there's no query.
                } else {
                    res.send(err);
                }
            });
        } else {
            if (req.query.timestamp == 0){

                Kit.find({'isDeleted': false}, (err, allKits) => {
                    if (!err){
                        res.status(200).json(allKits); 
                    } else {
                        res.send(err);
                    }
                });
            } else if (req.query.timestamp > 0){

                Kit.find((err, allKits) => {
                    if (!err){

                        const foundKits = [];

                        allKits.forEach((item) => {
                            const dateCreatedAt = item.createdAt;

                            /* console.log("Date created: "); 
                            console.log(dateCreatedAt.getTime()); */ //Shows the date in milliseconds (since 01/01/1970)

                            const dateUpdatedAt = item.updatedAt;

                            /* console.log("Date updated: "); 
                            console.log(dateUpdatedAt.getTime()); */
    
                            const dateOfTimestamp = new Date(+req.query.timestamp);

                            /* console.log("Date timestamp: "); 
                            console.log(dateOfTimestamp.getTime());
                            console.log("\n"); */
    
                            if (dateCreatedAt.getTime() > dateOfTimestamp.getTime() || dateUpdatedAt.getTime() > dateOfTimestamp.getTime()){
                                foundKits.push(item);
                            }
                        });
                        
                        res.status(200).json(foundKits);

                    } else {
                        res.send(err);
                    }
                });
            }
        }
    });
}

