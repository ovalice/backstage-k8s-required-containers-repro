import { KubernetesContainerRunner } from "@backstage/backend-common";
import { createTemplateAction } from "@backstage/plugin-scaffolder-node";
import { KubeConfig } from '@kubernetes/client-node';


export const createAction = () => {
  return createTemplateAction({
    id: 'action',
    handler: async () => {
      const kubeConfig = new KubeConfig();
      kubeConfig.loadFromDefault();

      const runner = new KubernetesContainerRunner({
        kubeConfig,
        name: 'scaffolder',
        namespace: 'default',
        mountBase: {
          volumeName: 'scaffolder',
          basePath: '/mount'
        },
        podTemplate: {
          spec: {
            volumes: [
              {
                name: 'scaffolder',
                hostPath: {
                  path: '/tmp/to-mount',
                }
              }
            ],
          }
        }
      })

      await runner.runContainer({
        imageName: 'ubuntu',
        args: ['sleep', '300'],
        mountDirs: {
          '/mount/': '/workspace'
        },
        workingDir: '/workspace'
      })
    }
  })
}