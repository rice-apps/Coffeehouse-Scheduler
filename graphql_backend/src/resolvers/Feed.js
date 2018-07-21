function links(parent, args, context, info) {
  // Using parent here to reference parent resolver (Query)
  return context.db.query.links({ where: { id_in: parent.linkIds } }, info)
}

module.exports = {
  links,
}
