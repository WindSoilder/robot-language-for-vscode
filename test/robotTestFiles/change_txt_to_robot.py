import os
from os.path import isfile

if __name__ == '__main__':
    current_path = os.getcwd()
    file_list = os.listdir()
    for file_name in file_list:
        if isfile(file_name):
            (name, suffix) = file_name.split('.')
            if suffix == 'txt':
                os.rename(file_name, "{name}.{suffix}".format(name=name, suffix="robot"))
