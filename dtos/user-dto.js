module.exports = class UserDto{
    email;
    name;
    surname;
    id;
    isActivated;

    constructor(model) {
        this.id = model._id
        this.email = model.email
        this.name = model.name
        this.surname = model.surname
        this.isActivated = model.isActivated
    }
}