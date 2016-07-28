var UnixTimestamps = function( schema ) {
    schema.add( {
        createdAt: Number,
        updatedAt: Number
    } );

    schema.pre( 'save', function( next ) {
        //console.log("Pre Save")
        if ( !this.createdAt ) {
            this.createdAt = this.updatedAt = Date.now() / 1000;
        }
        else {
            this.updatedAt = Date.now() / 1000;
        }
        next();
    } );
    schema.pre('findOneAndUpdate', function() {
        //console.log("Pre findOneAndUpdate")
        this.update({},{ $set: { updatedAt: Date.now() / 1000 } });
    });
    schema.pre('update', function() {
        //console.log("Pre update")
        this.update({},{ $set: { updatedAt: Date.now() / 1000 } });
    });
};

module.exports = UnixTimestamps