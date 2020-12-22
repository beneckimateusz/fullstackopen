describe('blog app', function () {
  beforeEach(function () {
    const user = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'password',
    };

    cy.request('POST', 'http://localhost:3001/api/testing/reset').then(() => {
      cy.createUser(user);
      cy.visit('http://localhost:3000');
    });
  });

  it('login form data is shown', function () {
    cy.contains('log in').click();
    cy.get('.login-section input[name="username"]').should('be.visible');
    cy.get('.login-section input[name="password"]').should('be.visible');
    cy.get('.login-section').contains('login');
  });

  describe('login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click();
      cy.get('.login-section input[name="username"]').type('johndoe');
      cy.get('.login-section input[name="password"]').type('password');
      cy.get('.login-section__submit-button').click();
      cy.get('.notification--success').should('contain', 'logged in');
      cy.contains('John Doe logged in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('log in').click();
      cy.get('.login-section input[name="username"]').type('johndoe');
      cy.get('.login-section input[name="password"]').type('wrong');
      cy.get('.login-section__submit-button').click();
      cy.get('.notification--error').should('contain', 'invalid');
    });
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login('johndoe', 'password');
    });

    it('a blog can be created', function() {
      cy.contains('new blog').click();
      cy.get('.create-blog input[name="title"]').type('someblog');
      cy.get('.create-blog input[name="author"]').type('someauthor');
      cy.get('.create-blog input[name="url"]').type('someurl');
      cy.get('.create-blog__submit-button').click();

      cy.get('.blogs').contains('someblog').parent().as('blog');
      cy.get('@blog').contains('someauthor');
    });

    describe('when there is an existing blog', function() {
      beforeEach(function() {
        const blog = { title: 'sometitle', author: 'someauthor', url: 'someurl' };
        cy.createBlog(blog);
      });

      it('a blog can be liked', function() {
        cy.get('.blogs').contains('sometitle').parent().as('blog');
        cy.get('@blog').contains('view').click();
        cy.get('@blog').contains('likes 0');
        cy.get('@blog').contains('like').click();
        cy.get('@blog').contains('likes 1');
      });

      it('a user who created it can delete it', function() {
        cy.get('.blogs').contains('sometitle').parent().as('blog');
        cy.get('@blog').contains('view').click();
        cy.get('@blog').contains('remove').click();
        cy.get('.blogs').should('not.contain', 'sometitle');
      });
    });

    describe('when there are several existing blogs', function () {
      beforeEach(function() {
        cy.createBlog({ title: 'blog1', author: 'author1', url: 'url1', likes: 3 });
        cy.createBlog({ title: 'blog2', author: 'author2', url: 'url2', likes: 1 });
        cy.createBlog({ title: 'blog3', author: 'author3', url: 'url3', likes: 7 });
      });

      it.only('blogs are order by likes descending', function() {
        const likes = [];
        cy.get('.blog').each(blog => {
          cy.wrap(blog)
            .contains('view')
            .click()
            .then(() => {
              cy.wrap(blog)
                .get('.likes-count')
                .then(num => {
                  likes.push(Number(num));
                  let sortedDescending = true;
                  for (let i = 0; i < likes.length - 1; i++) {
                    if (likes[i] < likes[i+1]) {
                      sortedDescending = false;
                      break;
                    }
                  }

                  expect(sortedDescending).equal(true);
                });
            });
        });
      });
    });
  });
});
