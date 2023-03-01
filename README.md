# Todo list I created a while back adapted to use react

TODO

- drag and drop
- editing project (on click -> input??)
- views
- add property
- delete property
- backend
- sort
- filter

Random Notes

- when a new property is added all the todos need to be updated
- notes hold a value and html?
- depending on hov i do labels may run into problem with hover
- prevent paste maybe - oncopy="return false" oncut="return false" onpaste="return false">
- for properties -> inline style and just get properties count for the repeat
- view uses router (so does each todo but idk if necessary)
  next
- !ReactDOM.findDOMNode(this).contains(e.target)

Currently

- created time (just a date thats disabled)
- different types of components (date, select, notes)
- date picker -> main content - 2nd overlay (useEffect in main content checks for state) use context - make sure escape works too (z index?)
