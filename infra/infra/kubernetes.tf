data "kustomization_build" "dev" {
  path = trimspace("${var.manifests_overlay_path}/dev")
}

resource "kustomization_resource" "dev" {
  depends_on = [helm_release.external_secrets]
  for_each   = data.kustomization_build.dev.ids
  manifest   = data.kustomization_build.dev.manifests[each.value]
}
