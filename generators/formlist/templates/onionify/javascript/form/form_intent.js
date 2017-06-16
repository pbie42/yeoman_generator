import xs from 'xstream'

export default function intent(sources) {
  <% inputs.forEach(i => { %>
  const <%= i %> = sources.DOM.select('#<%= i %>').events('input')
                             .map(ev => ({ <%= itemNameL>: { <%= i %>: ev.target.value } }))<% }) %>

  const submitter = sources.DOM.select('#submit').events('click').mapTo(null)
  const editor = sources.DOM.select('#editSubmit').events('click').mapTo(null)

  const actions = xs.merge(<% inputs.forEach(i => { %><%= i %>, <% }) %>)

  return { actions, submitter, editor }
}
