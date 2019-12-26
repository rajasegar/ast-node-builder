class PersonController extends Controller {
  @tracked
  firstName = 'Yehuda';

  @tracked
  lastName = 'Katz';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}