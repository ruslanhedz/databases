from reg_log.models import UserProfile
from animals_management.models import Animal

class MasterSlaveRouter:
    def db_for_read(self, model, **hints):
        return 'slave'

    def db_for_write(self, model, **hints):
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        print(f"Checking relation: {obj1._meta.app_label} <-> {obj2._meta.app_label}")
        if (obj1._meta.app_label == 'animals_management' and obj2._meta.app_label == 'reg_log') or \
                (obj2._meta.app_label == 'animals_management' and obj1._meta.app_label == 'reg_log') or \
                    (obj1._meta.app_label == 'animals_management' and obj2._meta.app_label == 'auth') or \
                        (obj2._meta.app_label == 'animals_management' and obj1._meta.app_label == 'auth') or \
                            (obj1._meta.app_label == 'animals_management' and obj2._meta.app_label == 'animals_management') or \
                                (obj2._meta.app_label == 'animals_management' and obj1._meta.app_label == 'animals_management'):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return db == 'default'
